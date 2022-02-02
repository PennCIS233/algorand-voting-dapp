from pyteal import *


def approval_program():
    i = ScratchVar(TealType.uint64) # i-variable for for-loop

    on_creation = Seq(
        [
            App.globalPut(Bytes("Creator"), Txn.sender()),
            Assert(Txn.application_args.length() == Int(6)),
            App.globalPut(Bytes("RegBegin"), Btoi(Txn.application_args[0])),
            App.globalPut(Bytes("RegEnd"), Btoi(Txn.application_args[1])),
            App.globalPut(Bytes("VoteBegin"), Btoi(Txn.application_args[2])),
            App.globalPut(Bytes("VoteEnd"), Btoi(Txn.application_args[3])),

            # number of options there are to vote for
            App.globalPut(Bytes("NumVoteOptions"), Btoi(Txn.application_args[4])),

            # set all initial vote tallies to 0 for all vote options
            For(
                i.store(Int(0)),
                i.load() < Btoi(Txn.application_args[4]),
                i.store(i.load() + Int(1))
            ).Do(
                App.globalPut(Concat(Bytes("VotesFor"), Itob(i.load())), Int(0))
            ),

            # string of options separated by commas ie: "Tim,John,Max,Sally"
            App.globalPut(Bytes("VoteOptions"), Txn.application_args[5]),

            Return(Int(1)),
        ]
    )

    is_creator = Txn.sender() == App.globalGet(Bytes("Creator"))

    # value sender voted for, a number indicating index in the VoteOptions string faux-array
    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))
    # value of whether or not the sender can vote ("yes", "no", or "maybe")
    get_sender_can_vote = App.localGetEx(Int(0), App.id(), Bytes("can_vote"))

    # if the user closes out of program before the end of voting period
    # remove their vote from the correct vote tally
    on_closeout = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),
                    get_vote_of_sender.hasValue(),
                ),
                App.globalPut(
                    Concat(Bytes("VotesFor"), Itob(get_vote_of_sender.value())),
                    App.globalGet(Concat(Bytes("VotesFor"), Itob(get_vote_of_sender.value()))) - Int(1)
                ),
            ),
            Return(Int(1)),
        ]
    )


    on_register = Seq(
        # ensure users are registering during registration period
        Assert(
            And(
                Global.round() >= App.globalGet(Bytes("RegBegin")),
                Global.round() <= App.globalGet(Bytes("RegEnd")),
            )
        ),

        # Set users voting status to maybe
        App.localPut(Int(0), Bytes("can_vote"), Bytes("maybe")),

        # Add user to approval queue
        App.globalPut(
            Bytes("ApprovalQueue"),
            App.globalGet(Bytes("ApprovalQueue").concatenate(Txn.sender()))
        ),

        Return(Int(1))
    )

    address_to_approve = Txn.application_args[1]
    is_user_approved = Txn.application_args[2] # "yes" or "no"
    new_approval_queue = Txn.application_args[3] # new approval queue without the address that was just approved
    on_update_user_status = Seq(
        get_sender_can_vote,
        Assert(
            And(
                is_creator, # only the creator can approve/disapprove users
                get_sender_can_vote.value() == Bytes("maybe") # creator can only change status once
            )
        ),

        # edit the user's local data on whether they can vote or not
        App.localPut(address_to_approve, Bytes("can_vote"), is_user_approved),

        # update the new queue
        App.globalPut(Bytes("ApprovalQueue"), new_approval_queue),

        Return(Int(1))
    )

    choice = Btoi(Txn.application_args[1])
    on_vote = Seq(
        [
            Assert(
                And(
                    Global.round() >= App.globalGet(Bytes("VoteBegin")),
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),

                    # ensure user is allowed to vote
                    get_sender_can_vote.value() == Bytes("yes")
                )
            ),
            get_vote_of_sender,
            If(get_vote_of_sender.hasValue(), Return(Int(0))), # ensure user hasn't already voted
            Assert(
                And(
                    # Not(get_vote_of_sender.hasValue()), # ensure user hasn't already voted
                    choice >= Int(0), # ensure vote choice is within index bounds
                    choice < App.globalGet(Bytes("NumVoteOptions")),
                )
            ),
            App.globalPut(
                Concat(Bytes("VotesFor"), Itob(choice)),
                App.globalGet(Concat(Bytes("VotesFor"), Itob(choice))) + Int(1)
            ),
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


def clear_state_program():
    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))

    # if the user clears state of program before the end of voting period
    # remove their vote from the correct vote tally
    program = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),
                    get_vote_of_sender.hasValue(),
                ),
                App.globalPut(
                    Concat(Bytes("VotesFor"), Itob(get_vote_of_sender.value())),
                    App.globalGet(Concat(Bytes("VotesFor"), Itob(get_vote_of_sender.value()))) - Int(1)
                ),
            ),
            Return(Int(1)),
        ]
    )

    return program


if __name__ == "__main__":
    with open("vote_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=2)
        f.write(compiled)

    with open("vote_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=2)
        f.write(compiled)
