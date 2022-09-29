import { BigNumber, BigNumberish, ethers } from "ethers";

export const getEventTicketPriceRangeLabel = (
  tickets: { price: number | string | undefined; isFree: boolean }[]
): string =>
  console.log(tickets) || tickets && tickets.length
    ? tickets.length > 1
      ? "TIERED"
      : getEventTicketPriceLabel(tickets[0])
    : "-";

export const getEventTicketPriceLabel = (
  ticket: Parameters<typeof getEventTicketPriceRangeLabel>[0][0]
): string =>
  ticket.isFree
    ? "FREE"
    : [undefined, ""].includes(ticket.price)
    ? "-"
    : `$${(+ticket.price!).toFixed(2)}`;

export const getEventTicketTotalSupplyLabel = (
  tickets?: {
    isUnlimitedSupply: boolean;
    supply: number | string | undefined;
  }[]
) =>
  tickets?.filter(({ isUnlimitedSupply }) => isUnlimitedSupply).length
    ? "∞"
    : tickets
        ?.map((ticket) => +(ticket.supply || 0))
        .reduce((a, b) => a + b, 0) || "-";

export const getEventTicketNativeCurrencyPriceLabel = (
  ticket: {
    price: number | string | undefined;
  },
  nativeCurrencyToUsdPrice?: BigNumber
) =>
  ticket.price && nativeCurrencyToUsdPrice
    ? `~${(+ethers.utils.formatUnits(
        nativeCurrencyToUsdPrice.mul(+ticket.price),
        8
      )).toFixed(4)} MATIC`
    : "";
