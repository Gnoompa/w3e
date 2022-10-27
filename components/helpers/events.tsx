import { BigNumber, BigNumberish, ethers } from "ethers";
import pluralize from "pluralize";

export const getEventTicketPriceRangeLabel = (
  tickets: { price: BigNumberish | undefined; isFree: boolean }[]
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
    Math.min(
      tickets
        .map(({ price }) => +ethers.utils.formatUnits(price?.toString()))
        .filter(Boolean)
        .sort()[0] || 0,
      99999
    )?.toFixed(2) || "FREE"
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
    : `$${Math.min(+ethers.utils.formatUnits(ticket.price?.toString()), 99999)
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
        nativeCurrencyToUsdPrice.mul(ticket.price),
        26
      )).toFixed(4)} MATIC`
    : "";

export const getEventParticipantsAmountLabel = (
  ticketTiers: { ticketsSoldAmount: BigNumberish }[]
) =>
  ((ticketTiersSoldTicketAmount) =>
    `${+ticketTiersSoldTicketAmount || 0} ${pluralize(
      "ticket",
      ticketTiersSoldTicketAmount
    )} sold`)(
    ticketTiers.length > 1
      ? ticketTiers.reduceRight(
          (a, b) => +a.ticketsSoldAmount + +b.ticketsSoldAmount
        )
      : ticketTiers?.[0]?.ticketsSoldAmount || 0
  );

export const getEventTicketTierLeftSupply = (ticketTier: {
  ticketSupply: BigNumberish;
  ticketsSoldAmount: BigNumberish;
  ticketParams: BigNumberish;
}) =>
  +ticketTier.ticketParams & (1 << 3)
    ? Infinity
    : +ticketTier.ticketSupply - +ticketTier.ticketsSoldAmount;

export const getEventTicketTierLeftSupplyLabel = (ticketTier: {
  ticketSupply: BigNumberish;
  ticketsSoldAmount: BigNumberish;
  ticketParams: BigNumberish;
}) =>
  ((eventTicketTierLeftSupply) =>
    `(${
      eventTicketTierLeftSupply == Infinity ? "∞" : eventTicketTierLeftSupply
    } left${
      eventTicketTierLeftSupply <= 10 && eventTicketTierLeftSupply > 0
        ? " 🔥)"
        : ")"
    }`)(getEventTicketTierLeftSupply(ticketTier));
