import {
  Config,
  GroupConfig,
  MangoInstructionLayout,
  PerpMarket,
  PerpMarketConfig,
  PerpMarketLayout,
  SpotMarketConfig,
} from "@blockworks-foundation/mango-client";
import { Market } from "@project-serum/serum";
import {
  AccountMeta,
  Connection,
  TransactionInstruction,
} from "@solana/web3.js";

// todo: fix types in entire file

const mainnetGroupConfig = Config.ids().getGroup(
  "mainnet",
  "mainnet.0"
) as GroupConfig;

const devnetGroupConfig = Config.ids().getGroup(
  "devnet",
  "devnet.1"
) as GroupConfig;

export const isMangoInstruction = (instruction: TransactionInstruction) => {
  return [
    mainnetGroupConfig.mangoProgramId.toBase58(),
    devnetGroupConfig.mangoProgramId.toBase58(),
  ].includes(instruction.programId.toBase58());
};

export const INSTRUCTION_LOOKUP: { [key: number]: string } = {
  0: "InitMangoGroup",
  1: "InitMangoAccount",
  2: "Deposit",
  3: "Withdraw",
  4: "AddSpotMarket",
  5: "AddToBasket",
  6: "Borrow",
  7: "CachePrices",
  8: "CacheRootBanks",
  9: "PlaceSpotOrder",
  10: "AddOracle",
  11: "AddPerpMarket",
  12: "PlacePerpOrder",
  13: "CancelPerpOrderByClientId",
  14: "CancelPerpOrder",
  15: "ConsumeEvents",
  16: "CachePerpMarkets",
  17: "UpdateFunding",
  18: "SetOracle",
  19: "SettleFunds",
  20: "CancelSpotOrder",
  21: "UpdateRootBank",
  22: "SettlePnl",
  23: "SettleBorrow",
  24: "ForceCancelSpotOrders",
  25: "ForceCancelPerpOrders",
  26: "LiquidateTokenAndToken",
  27: "LiquidateTokenAndPerp",
  28: "LiquidatePerpMarket",
  29: "SettleFees",
  30: "ResolvePerpBankruptcy",
  31: "ResolveTokenBankruptcy",
  32: "InitSpotOpenOrders",
  33: "RedeemMngo",
  34: "AddMangoAccountInfo",
  35: "DepositMsrm",
  36: "WithdrawMsrm",
  37: "ChangePerpMarketParams",
};

export const parseMangoInstructionTitle = (
  instruction: TransactionInstruction
): string => {
  const code = instruction.data[0];

  if (!(code in INSTRUCTION_LOOKUP)) {
    throw new Error(`Unrecognized Mango instruction code: ${code}`);
  }
  return INSTRUCTION_LOOKUP[code];
};

export type Deposit = {
  quantity: number;
};

export const decodeDeposit = (ix: TransactionInstruction): Deposit => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const deposit: Deposit = {
    quantity: decoded.Deposit.quantity.toNumber(),
  };
  return deposit;
};

export type AddToBasket = {
  marketIndex: number;
};

export const decodeAddToBasket = (ix: TransactionInstruction): AddToBasket => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const addToBasket: AddToBasket = {
    marketIndex: decoded.AddToBasket.marketIndex.toNumber(),
  };
  return addToBasket;
};

export type Withdraw = {
  quantity: number;
  allowBorrow: String;
};

export const decodeWithdraw = (ix: TransactionInstruction): Withdraw => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const withdraw: Withdraw = {
    quantity: decoded.Withdraw.quantity.toNumber(),
    allowBorrow: decoded.Withdraw.allowBorrow.toString(),
  };
  return withdraw;
};

export type PlaceSpotOrder = {
  side: String;
  limitPrice: number;
  maxBaseQuantity: number;
  maxQuoteQuantity: number;
  selfTradeBehavior: String;
  orderType: String;
  clientId: String;
  limit: String;
};

export const decodePlaceSpotOrder = (
  ix: TransactionInstruction
): PlaceSpotOrder => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const placeSpotOrder: PlaceSpotOrder = {
    side: decoded.PlaceSpotOrder.side.toString(),
    limitPrice: decoded.PlaceSpotOrder.limitPrice.toNumber(),
    maxBaseQuantity: decoded.PlaceSpotOrder.maxBaseQuantity.toNumber(),
    maxQuoteQuantity: decoded.PlaceSpotOrder.maxQuoteQuantity.toNumber(),
    selfTradeBehavior: decoded.PlaceSpotOrder.selfTradeBehavior,
    orderType: decoded.PlaceSpotOrder.orderType.toString(),
    clientId: decoded.PlaceSpotOrder.clientId.toString(),
    limit: decoded.PlaceSpotOrder.limit.toString(),
  };

  return placeSpotOrder;
};

export type CancelSpotOrder = {
  orderId: String;
  side: String;
};

export const decodeCancelSpotOrder = (
  ix: TransactionInstruction
): CancelSpotOrder => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const cancelSpotOrder: CancelSpotOrder = {
    orderId: decoded.CancelSpotOrder.orderId.toString(),
    side: decoded.CancelSpotOrder.side.toString(),
  };
  return cancelSpotOrder;
};

export type PlacePerpOrder = {
  price: number;
  quantity: number;
  clientOrderId: String;
  side: String;
  orderType: String;
};
export const decodePlacePerpOrder = (
  ix: TransactionInstruction
): PlacePerpOrder => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const placePerpOrder: PlacePerpOrder = {
    price: decoded.PlacePerpOrder.price.toNumber(),
    quantity: decoded.PlacePerpOrder.quantity.toNumber(),
    clientOrderId: decoded.PlacePerpOrder.clientOrderId.toString(),
    side: decoded.PlacePerpOrder.side.toString(),
    orderType: decoded.PlacePerpOrder.orderType.toString(),
  };

  return placePerpOrder;
};

export type CancelPerpOrder = {
  orderId: String;
  invalidIdOk: String;
};

export const decodeCancelPerpOrder = (
  ix: TransactionInstruction
): CancelPerpOrder => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const cancelPerpOrder: CancelPerpOrder = {
    orderId: decoded.CancelPerpOrder.orderId.toString(),
    invalidIdOk: decoded.CancelPerpOrder.invalidIdOk.toString(),
  };
  return cancelPerpOrder;
};

export type ChangePerpMarketParams = {
  maintLeverageOption: Boolean;
  maintLeverage: number;
  initLeverageOption: Boolean;
  initLeverage: number;
  liquidationFeeOption: Boolean;
  liquidationFee: number;
  makerFeeOption: Boolean;
  makerFee: number;
  takerFeeOption: Boolean;
  takerFee: number;
  rateOption: Boolean;
  rate: number;
  maxDepthBpsOption: Boolean;
  maxDepthBps: number;
  targetPeriodLengthOption: Boolean;
  targetPeriodLength: number;
  mngoPerPeriodOption: Boolean;
  mngoPerPeriod: number;
};

export const decodeChangePerpMarketParams = (
  ix: TransactionInstruction
): ChangePerpMarketParams => {
  const decoded = MangoInstructionLayout.decode(ix.data);
  const changePerpMarketParams: ChangePerpMarketParams = {
    maintLeverageOption: decoded.ChangePerpMarketParams.maintLeverageOption,
    maintLeverage: decoded.ChangePerpMarketParams.maintLeverage.toString(),
    initLeverageOption: decoded.ChangePerpMarketParams.initLeverageOption,
    initLeverage: decoded.ChangePerpMarketParams.initLeverage.toString(),
    liquidationFeeOption: decoded.ChangePerpMarketParams.liquidationFeeOption,
    liquidationFee: decoded.ChangePerpMarketParams.liquidationFee.toString(),
    makerFeeOption: decoded.ChangePerpMarketParams.makerFeeOption,
    makerFee: decoded.ChangePerpMarketParams.makerFee.toString(),
    takerFeeOption: decoded.ChangePerpMarketParams.takerFeeOption,
    takerFee: decoded.ChangePerpMarketParams.takerFee.toString(),
    rateOption: decoded.ChangePerpMarketParams.rateOption,
    rate: decoded.ChangePerpMarketParams.rate.toString(),
    maxDepthBpsOption: decoded.ChangePerpMarketParams.maxDepthBpsOption,
    maxDepthBps: decoded.ChangePerpMarketParams.maxDepthBps.toString(),
    targetPeriodLengthOption:
      decoded.ChangePerpMarketParams.targetPeriodLengthOption,
    targetPeriodLength:
      decoded.ChangePerpMarketParams.targetPeriodLength.toString(),
    mngoPerPeriodOption: decoded.ChangePerpMarketParams.mngoPerPeriodOption,
    mngoPerPeriod: decoded.ChangePerpMarketParams.mngoPerPeriod.toString(),
  };
  console.log(changePerpMarketParams);
  return changePerpMarketParams;
};

export type OrderLotDetails = {
  price: number;
  size: number;
};

////

export function logAllKeys(keys: AccountMeta[]) {
  keys.map((key) => console.log(key.pubkey.toBase58()));
}

export function getPerpMarketFromInstruction(
  ix: TransactionInstruction,
  keyLocation: number
) {
  const perpMarket = ix.keys[keyLocation];

  if (ix.programId.equals(devnetGroupConfig.mangoProgramId)) {
    return devnetGroupConfig.perpMarkets.filter((mangoPerpMarket) =>
      perpMarket.pubkey.equals(mangoPerpMarket.publicKey)
    )[0];
  }

  return mainnetGroupConfig.perpMarkets.filter((mangoPerpMarket) =>
    perpMarket.pubkey.equals(mangoPerpMarket.publicKey)
  )[0];
}

export function getSpotMarketFromInstruction(
  ix: TransactionInstruction,
  keyLocation: number
) {
  const spotMarket = ix.keys[keyLocation];
  if (ix.programId.equals(devnetGroupConfig.mangoProgramId)) {
    return devnetGroupConfig.spotMarkets.filter((mangoSpotMarket) =>
      spotMarket.pubkey.equals(mangoSpotMarket.publicKey)
    )[0];
  }
  return mainnetGroupConfig.spotMarkets.filter((mangoSpotMarket) =>
    spotMarket.pubkey.equals(mangoSpotMarket.publicKey)
  )[0];
}

export async function getSpotMarketFromSpotMarketConfig(
  ix: TransactionInstruction,
  clusterUrl: string,
  mangoSpotMarketConfig: SpotMarketConfig
): Promise<Market> {
  const connection = new Connection(clusterUrl);
  if (ix.programId.equals(devnetGroupConfig.mangoProgramId)) {
    return await Market.load(
      connection,
      mangoSpotMarketConfig.publicKey,
      undefined,
      devnetGroupConfig.serumProgramId
    );
  }
  return await Market.load(
    connection,
    mangoSpotMarketConfig.publicKey,
    undefined,
    mainnetGroupConfig.serumProgramId
  );
}

export async function getPerpMarketFromPerpMarketConfig(
  clusterUrl: string,
  mangoPerpMarketConfig: PerpMarketConfig
): Promise<PerpMarket> {
  const connection = new Connection(clusterUrl);
  const acc = await connection.getAccountInfo(mangoPerpMarketConfig.publicKey);
  const decoded = PerpMarketLayout.decode(acc?.data);
  return new PerpMarket(
    mangoPerpMarketConfig.publicKey,
    mangoPerpMarketConfig.baseDecimals,
    mangoPerpMarketConfig.quoteDecimals,
    decoded
  );
}
