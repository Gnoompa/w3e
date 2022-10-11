import { BigNumber, BigNumberish, ethers } from "ethers";

export const getEventTicketPriceRangeLabel = (
  tickets: { price: number | string | undefined; isFree: boolean }[]
): string =>
  tickets && tickets.length
    ? tickets.length > 1
      ? `FROM $${getEventTicketPriceFromLabel(tickets)}`.replaceAll(
          /(FROM \$FREE)|(FROM \$0.00)/g,
          "FREE"
        )
      : getEventTicketPriceLabel(tickets[0])
    : "-";

export const getEventTicketPriceFromLabel = (
  tickets: Parameters<typeof getEventTicketPriceRangeLabel>[0][0][]
): string =>
  (
    Math.min(tickets.map(({ price }) => +price).sort()[0], 99999)?.toFixed(2) ||
    "FREE"
  )
    .toString()
    .replace("99999", "99999+");

export const getEventTicketPriceLabel = (
  ticket: Parameters<typeof getEventTicketPriceRangeLabel>[0][0]
): string =>
  ticket.isFree
    ? "FREE"
    : [undefined, ""].includes(ticket.price)
    ? "-"
    : `$${Math.min(+ticket.price!, 99999)
        ?.toFixed(2)
        .toString()
        .replace("99999.00", "99999+")}`;

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
