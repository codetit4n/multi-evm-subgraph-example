import { BigInt } from "@graphprotocol/graph-ts"
import {
  SubgraphNFT,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer
} from "../generated/SubgraphNFT/SubgraphNFT"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {

}

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

export function handleTransfer(event: Transfer): void {
  let entity = ExampleEntity.load(event.transaction.from.toHex())
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())
    entity.count = BigInt.fromI32(0)
  }
  entity.count = entity.count.plus(BigInt.fromI32(1));

  entity.save()
}
