from pyteal import *
from pyteal_helper import itoa

# Election Smart Contract Simplified Overview
# 1.  Creator deploys smart contract
# 2.  User(s) opt-in to the contract
# 3.  Creator approves/reject user's ability to vote
# 4.  Approved user can cast vote once
# 4b. Approved user who voted can remove their vote (potentially then revote) if they closeout or clear program
# 5.  Repeat 2 to 4 for each user who opts-in before the election end
# 6.  Election ends and no further changes (opt-ins, votes, approvals/rejects) can be made to the election


# approval_program handles the main logic of the application
def approval_program():
    i = ScratchVar(TealType.uint64) # i-variable for for-loop

    on_creation = Seq(
        [
            # ensure all required arguments are present
            Assert(Txn.application_args.length() == Int(3)),

            # the round number (analogous to time) for the end of the election, no more registering, no more voting
            App.globalPut(Bytes("ElectionEnd"), Btoi(Txn.application_args[0])),

            # number of options there are to vote for
            App.globalPut(Bytes("NumVoteOptions"), Btoi(Txn.application_args[1])),

            # set all initial vote tallies to 0 for all vote options, keys are VotesFor0, VotesFor1, VotesFor2, etc
            For(
                i.store(Int(0)),
                i.load() < Btoi(Txn.application_args[1]),
                i.store(i.load() + Int(1))
            ).Do(
                App.globalPut(Concat(Bytes("VotesFor"), itoa(i.load())), Int(0))
            ),

            # string of options separated by commas ie: "A,B,C,D". Note that index-wise, A=0, B=1, C=2, D=3
            App.globalPut(Bytes("VoteOptions"), Txn.application_args[2]),

            Return(Int(1)),
        ]
    )

    # call to determine whether the current transaction sender is the creator of the smart contract
    is_creator = Txn.sender() == Global.creator_address()

    # value sender voted for, a number indicating index in the VoteOptions string faux-array
    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))
    # value of whether or not the sender can vote ("yes", "no", or "maybe")
    get_sender_can_vote = App.localGetEx(Int(0), App.id(), Bytes("can_vote"))

    # if the user closes out of program before the end of election
    # remove their vote from the correct vote tally
    on_closeout = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    # ensure the election hasn't ended
                    Global.round() <= App.globalGet(Bytes("ElectionEnd")),
                    # make sure the user had actually voted
                    get_vote_of_sender.hasValue(),
                ),
                # update vote tally by removing one vote for whom the user voted for
                App.globalPut(
                    Concat(Bytes("VotesFor"), itoa(get_vote_of_sender.value())),
                    App.globalGet(Concat(Bytes("VotesFor"), itoa(get_vote_of_sender.value()))) - Int(1)
                ),
            ),

            Return(Int(1))
        ]
    )

    # registration logic
    on_register = Seq(
        # ensure users are registering before the end of the election
        Assert(Global.round() <= App.globalGet(Bytes("ElectionEnd"))),

        # Set users voting status to maybe
        App.localPut(Int(0), Bytes("can_vote"), Bytes("maybe")),

        Return(Int(1))
    )

    # update user status logic
    address_to_approve = Txn.application_args[1] # address creator is trying to approve/reject
    is_user_approved = Txn.application_args[2] # "yes" or "no"
    on_update_user_status = Seq(
        Assert(
            And(
                is_creator, # only the creator can approve/disapprove users
                Global.round() <= App.globalGet(Bytes("ElectionEnd")), # can only approve users before election ends
                App.localGet(address_to_approve, Bytes("can_vote")) == Bytes("maybe") # creator can only change status once
            )
        ),

        # edit the user's local data on whether they can vote or not
        App.localPut(address_to_approve, Bytes("can_vote"), is_user_approved),

        Return(Int(1))
    )

    # user voting logic
    # user's voting choice, faux-index for VotingOptions
    # example: VotingOptions="A,B,C,D" and user wants to vote for C, then choice=3
    choice = Btoi(Txn.application_args[1])
    on_vote = Seq(
        [
            get_sender_can_vote,
            Assert(
                And(
                    # ensure the election isn't over
                    Global.round() <= App.globalGet(Bytes("ElectionEnd")),
                    # ensure user is allowed to vote
                    get_sender_can_vote.value() == Bytes("yes")
                )
            ),
            get_vote_of_sender,
            If(get_vote_of_sender.hasValue(), Return(Int(0))), # ensure user hasn't already voted
            Assert(
                And(
                    choice >= Int(0), # ensure vote choice is within index bounds
                    choice < App.globalGet(Bytes("NumVoteOptions")),
                )
            ),

            # update vote tally for user's choice
            App.globalPut(
                Concat(Bytes("VotesFor"), itoa(choice)),
                App.globalGet(Concat(Bytes("VotesFor"), itoa(choice))) + Int(1)
            ),

            # update user's voted variable to reflect their choice
            App.localPut(Int(0), Bytes("voted"), choice),

            Return(Int(1))
        ]
    )

    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(is_creator)],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(is_creator)],
        [Txn.on_completion() == OnComplete.CloseOut, on_closeout],
        [Txn.on_completion() == OnComplete.OptIn, on_register],
        [Txn.application_args[0] == Bytes("vote"), on_vote],
        [Txn.application_args[0] == Bytes("update_user_status"), on_update_user_status],
    )

    return program


# clear_state_program is when an account clears its participation in a smart contract
def clear_state_program():
    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))

    # if the user clears state of program before the end of voting period
    # remove their vote from the correct vote tally
    program = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    # ensure the election hasn't ended
                    Global.round() <= App.globalGet(Bytes("ElectionEnd")),
                    # make sure the user had actually voted
                    get_vote_of_sender.hasValue(),
                ),
                App.globalPut(
                    Concat(Bytes("VotesFor"), itoa(get_vote_of_sender.value())),
                    App.globalGet(Concat(Bytes("VotesFor"), itoa(get_vote_of_sender.value()))) - Int(1)
                ),
            ),

            Return(Int(1))
        ]
    )

    return program


if __name__ == "__main__":
    with open("vote_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=5)
        f.write(compiled)

    with open("vote_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=5)
        f.write(compiled)
