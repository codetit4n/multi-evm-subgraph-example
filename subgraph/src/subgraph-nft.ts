import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  SubgraphNFT as ERC721,
  Transfer as TransferEvent,
  Approval,
  ApprovalForAll,
  OwnershipTransferred
} from "../generated/SubgraphNFT/SubgraphNFT"
import { Token, Owner, Contract, Transfer } from '../generated/schema';

export function handleTransfer(event: TransferEvent): void {
  log.debug('Transfer detected. From: {} | To: {} | TokenID: {}', [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.tokenId.toHexString(),
  ]);

  let previousOwner = Owner.load(event.params.from.toHexString());
  let newOwner = Owner.load(event.params.to.toHexString());
  let token = Token.load(event.params.tokenId.toHexString());
  let transferId = event.transaction.hash
    .toHexString()
    .concat(':'.concat(event.transactionLogIndex.toHexString()));
  let transfer = Transfer.load(transferId);
  let contract = Contract.load(event.address.toHexString());
  let instance = ERC721.bind(event.address);

  if (previousOwner == null) {
    previousOwner = new Owner(event.params.from.toHexString());

    previousOwner.balance = BigInt.fromI32(0);
  } else {
    let prevBalance = previousOwner.balance!;
    if (prevBalance.gt(BigInt.fromI32(0))) {
      previousOwner.balance = prevBalance.minus(BigInt.fromI32(1));
    }
  }

  if (newOwner == null) {
    newOwner = new Owner(event.params.to.toHexString());
    newOwner.balance = BigInt.fromI32(1);
  } else {
    let prevBalance = newOwner.balance!;
    newOwner.balance = prevBalance.plus(BigInt.fromI32(1));
  }

  if (token == null) {
    token = new Token(event.params.tokenId.toHexString());
    token.contract = event.address.toHexString();

    let uri = instance.try_tokenURI(event.params.tokenId);
    if (!uri.reverted) {
      token.uri = uri.value;
    }
  }

  token.owner = event.params.to.toHexString();

  if (transfer == null) {
    transfer = new Transfer(transferId);
    transfer.token = event.params.tokenId.toHexString();
    transfer.from = event.params.from.toHexString();
    transfer.to = event.params.to.toHexString();
    transfer.timestamp = event.block.timestamp;
    transfer.block = event.block.number;
    transfer.transactionHash = event.transaction.hash.toHexString();
  }

  if (contract == null) {
    contract = new Contract(event.address.toHexString());
  }

  let name = instance.try_name();
  if (!name.reverted) {
    contract.name = name.value;
  }

  let symbol = instance.try_symbol();
  if (!symbol.reverted) {
    contract.symbol = symbol.value;
  }

  previousOwner.save();
  newOwner.save();
  token.save();
  contract.save();
  transfer.save();
}

export function handleApproval(event: Approval): void {

}

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }