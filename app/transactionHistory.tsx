import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { TransactionBookDisplay } from '~/components/Transaction/TradeHistoric';
import { Frame } from '~/components/Wrappers/Frame';

export default function TransactionHistory() {
  return (
    <Frame>
      <DetailsHeader title="Transaction History" />
      <TransactionBookDisplay />
    </Frame>
  );
}
