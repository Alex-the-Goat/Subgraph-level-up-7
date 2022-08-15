import { Address } from "@graphprotocol/graph-ts";
import { TransferBatch, TransferSingle } from "../generated/Erc1155/Erc1155";
import { Collectible } from "../generated/schema";
import {
  getOrCreateAccount,
  getOrCreateCollectible1155,
  getOrCreateCollection1155,
} from "./utils";

export function handleTransferSingle(event: TransferSingle): void {
  let collection = getOrCreateCollection1155(event.address);
  let receiver = getOrCreateAccount(event.params._to);
  if (
    event.params._from ==
    Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    // THIS IS A MINT
    getOrCreateCollectible1155(
      collection.collectionAddress,
      collection.id,
      event.params._id,
      receiver.id,
      event.block.timestamp,
      event.params._value
    );
  } else {
    let collectibleId = collection.collectionAddress
      .toHexString()
      .concat("-")
      .concat(event.params._id.toHexString());
    let collectible = Collectible.load(collectibleId);
    if (collectible) {
      if (
        event.params._to ==
        Address.fromString("0x0000000000000000000000000000000000000000")
      ) {
        // THIS IS A BURN
        collectible.removed = event.block.timestamp;
      } else {
        let sender = getOrCreateAccount(event.params._from);
        collectible.owner = sender.id;
        collectible.modified = event.block.timestamp;
      }
      collectible.save();
    }
  }
}

export function handleTransferBatch(event: TransferBatch): void {
  let collection = getOrCreateCollection1155(event.address);
  let receiver = getOrCreateAccount(event.params._to);
  if (
    event.params._from ==
    Address.fromString("0x0000000000000000000000000000000000000000")
  ) {
    // THIS IS A MINT
    getOrCreateCollectible1155(
      collection.collectionAddress,
      collection.id,
      event.params._ids,
      receiver.id,
      event.block.timestamp,
      event.params._values
    );
  } else {
    let collectibleId = collection.collectionAddress
      .toHexString()
      .concat("-")
      .concat(event.params._id.toHexString());
    let collectible = Collectible.load(collectibleId);
    if (collectible) {
      if (
        event.params._to ==
        Address.fromString("0x0000000000000000000000000000000000000000")
      ) {
        // THIS IS A BURN
        collectible.removed = event.block.timestamp;
      } else {
        let sender = getOrCreateAccount(event.params._from);
        collectible.owner = sender.id;
        collectible.modified = event.block.timestamp;
      }
      collectible.save();
    }
  }
}
