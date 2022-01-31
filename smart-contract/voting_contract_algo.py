import pyteal
from pyteal import *


def approval_program():
    on_creation = Seq(
        [
            App.globalPut(Bytes("Creator"), Txn.sender()),
            Assert(Txn.application_args.length() == Int(4)),
            App.globalPut(Bytes("RegBegin"), Btoi(Txn.application_args[0])),
            App.globalPut(Bytes("RegEnd"), Btoi(Txn.application_args[1])),
            App.globalPut(Bytes("VoteBegin"), Btoi(Txn.application_args[2])),
            App.globalPut(Bytes("VoteEnd"), Btoi(Txn.application_args[3])),
            # define voting choices on creation
            App.globalPut(Bytes("VoteOption1"), Bytes("A"))),
            App.globalPut(Bytes("VoteOption2"), Bytes("B"))),
            App.globalPut(Bytes("VoteOption3"), Bytes("C"))),
            App.globalPut(Bytes("VoteOption4"), Bytes("D"))),
            App.globalPut(Bytes("VoteOption5"), Bytes("E"))),
            Return(Int(1)),
        ]
    )

    is_creator = Txn.sender() == App.globalGet(Bytes("Creator"))

    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))


    on_closeout = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),
                    get_vote_of_sender.hasValue(),
                ),
                App.globalPut(
                    get_vote_of_sender.value(),
                    App.globalGet(get_vote_of_sender.value()) - Int(1),
                ),
            ),
            Return(Int(1)),
        ]
    )

    user_address = Txn.application_args[0] #pass in as argument when user opts in 
    on_register = Return(
        And(
            Global.round() >= App.globalGet(Bytes("RegBegin")),
            Global.round() <= App.globalGet(Bytes("RegEnd")),
            # add in here another check that the user is one that we creator already approves of
        )
    )

    choice = Txn.application_args[1]
    choice_tally = App.globalGet(choice)
    on_vote = Seq(
        [
            Assert(
                And(
                    Global.round() >= App.globalGet(Bytes("VoteBegin")),
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),
                    
                )
            ),
            get_vote_of_sender,
            If(get_vote_of_sender.hasValue(), Return(Int(0))),
            Cond(
                [choice == App.globalGet(Bytes("VoteOption1")), Seq([
                App.globalPut(choice, choice_tally + Int(1)),
                App.localPut(Int(0), Bytes("voted"), choice),
                Return(Int(1)),
                ])],
                [choice == App.globalGet(Bytes("VoteOption2")), Seq([
                    App.globalPut(choice, choice_tally + Int(1)),
                    App.localPut(Int(0), Bytes("voted"), choice),
                    Return(Int(1)),
                ])],
                [choice == App.globalGet(Bytes("VoteOption3")), Seq([
                    App.globalPut(choice, choice_tally + Int(1)),
                    App.localPut(Int(0), Bytes("voted"), choice),
                    Return(Int(1)),
                ])],
                [choice == App.globalGet(Bytes("VoteOption4")), Seq([
                    App.globalPut(choice, choice_tally + Int(1)),
                    App.localPut(Int(0), Bytes("voted"), choice),
                    Return(Int(1)),
                ])],
                [choice == App.globalGet(Bytes("VoteOption5")), Seq([
                    App.globalPut(choice, choice_tally + Int(1)),
                    App.localPut(Int(0), Bytes("voted"), choice),
                    Return(Int(1)),
                ])]
            ),

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
    )

    return program


def clear_state_program():
    get_vote_of_sender = App.localGetEx(Int(0), App.id(), Bytes("voted"))
    program = Seq(
        [
            get_vote_of_sender,
            If(
                And(
                    Global.round() <= App.globalGet(Bytes("VoteEnd")),
                    get_vote_of_sender.hasValue(),
                ),
                App.globalPut(
                    get_vote_of_sender.value(),
                    App.globalGet(get_vote_of_sender.value()) - Int(1),
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