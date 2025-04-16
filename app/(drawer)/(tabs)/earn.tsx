import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useEmbeddedWallet, usePrivy } from '@privy-io/expo';

import { Button } from '~/components/Button';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { HeaderBar, PillMessageBox } from '~/components/HeaderBar';
import { ScrollView } from 'react-native';
import { Container } from '~/components/Container';

const COMET_ADDRESS = '0xc3d688B66703497DAA19211EEdff47f25384cdc3';
const USDC_ADDRESS = '0xd9AA94C3C8C80af2b9824e287fF06F7386C6c6d2';

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() view returns (uint8)',
];

const COMET_ABI = [
  'function supply(address asset, uint amount) external',
  'function withdraw(address asset, uint amount) external',
  'function balanceOf(address account) view returns (uint256)',
  'function getSupplyRate() external view returns (uint64)',
];

export default function CompoundUSDC() {
  // Récupère l'utilisateur via usePrivy()
  const user = usePrivy();
  const isAuthenticated = !!user;

  const earnPillContent = () => {
    return (
      <PillMessageBox>
		<FText className="!text-2xl" bold>
		Good Morning!
		</FText>
	  </PillMessageBox>
	);
	};
  // useEmbeddedWallet() renvoie un objet avec une propriété wallet et isInitializing
  const walletState = useEmbeddedWallet();
  const wallet = walletState.wallet;
  const isReady = !walletState.isInitializing;

  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [apr, setApr] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  // Récupère le signer à partir du wallet (s'il existe)
  useEffect(() => {
    if (wallet) {
      const provider = wallet.getProvider();
      if (provider) {
        setSigner(provider.getSigner());
      }
    }
  }, [wallet]);

  const fetchData = async () => {
    if (!signer) return;
    const address = await signer.getAddress();

    const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const comet = new ethers.Contract(COMET_ADDRESS, COMET_ABI, signer);

    const decimals = await usdc.decimals();
    const rawBalance = await usdc.balanceOf(address);
    setBalance(ethers.formatUnits(rawBalance, decimals));

    const rate = await comet.getSupplyRate();
    const aprCalc = (Number(rate) / 1e18) * 60 * 60 * 24 * 365 * 100;
    setApr(aprCalc.toFixed(2));
  };

  const deposit = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const address = await signer.getAddress();
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const comet = new ethers.Contract(COMET_ADDRESS, COMET_ABI, signer);
      const amount = await usdc.balanceOf(address);

      const allowance = await usdc.allowance(address, COMET_ADDRESS);
      if (allowance.lt(amount)) {
        const txApprove = await usdc.approve(COMET_ADDRESS, amount);
        await txApprove.wait();
      }

      const txSupply = await comet.supply(USDC_ADDRESS, amount);
      await txSupply.wait();
      await fetchData();
      alert("✅ Dépôt effectué");
    } catch (e) {
      console.error(e);
      alert("Erreur pendant le dépôt");
    }
    setLoading(false);
  };

  const withdraw = async () => {
    if (!signer) return;
    setLoading(true);
    try {
      const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const comet = new ethers.Contract(COMET_ADDRESS, COMET_ABI, signer);
      const address = await signer.getAddress();
      const amount = await usdc.balanceOf(address);

      const txWithdraw = await comet.withdraw(USDC_ADDRESS, amount);
      await txWithdraw.wait();
      await fetchData();
      alert("✅ Retrait effectué");
    } catch (e) {
      console.error(e);
      alert("Erreur pendant le retrait");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (signer) fetchData();
  }, [signer]);
  console.log("Signer:", signer);
  console.log("Wallet:", wallet);
  console.log("User:", user);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Is Ready:", isReady);
  if (!wallet || !isReady || !isAuthenticated || !signer) {
    return (<Frame>
				<HeaderBar title="Earn" pillContent={earnPillContent} />
				<ScrollView>
					<FText>🔒 Connecte-toi avec Privy pour interagir.</FText>
				</ScrollView>
			</Frame>);
  }

  return (
    <Frame>
      <HeaderBar title="Earn" pillContent={earnPillContent} />
	  <ScrollView>
		<FTitle>USDC</FTitle>
		
		<FText>Solde disponible : {balance} USDC</FText>
		
		
		<FText className="mb-4">
			APR actuel : {apr}%
		</FText>
		<Button
			onPress={deposit}
			disabled={loading}
			title={loading ? "Traitement..." : "📥 Déposer mes USDC sur Compound"}
		/>

		<Button
			onPress={withdraw}
			disabled={loading}
			title={loading ? "Traitement..." : "📤 Retirer mes USDC"}
		/> 
	  </ScrollView>
    </Frame>
  );
}
