import { ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { Button } from "~/components/Button";
import { HeaderBar, PillMessageBox } from "~/components/HeaderBar";
import { FText } from "~/components/Text/FText";
import { FTitle } from "~/components/Text/FTitle";
import { useAppData } from "~/components/Wrappers/AppData";
import { Frame } from "~/components/Wrappers/Frame";
import { getEthersSigner } from "~/services/Ethers/getEthersSigner";
// import { Token } from "~/types/supabaseTypes";

const COMET_ADDRESS = "0xb125E6687d4313864e53df431d5425969c15Eb2F"; // Adresse du contrat Compound III sur Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Adresse de l"USDC sur Base

const ERC20_ABI = [
	"function decimals() view returns (uint8)",
	"function balanceOf(address account) view returns (uint256)",
	"function approve(address spender, uint256 amount) external returns (bool)",
	"function allowance(address owner, address spender) external view returns (uint256)",
];

const COMET_ABI = [
	"function getSupplyRate() external view returns (uint64)",
	"function supply(address asset, uint amount) external",
	"function withdraw(address asset, uint amount) external",
	"function balanceOf(address account) view returns (uint256)",
];

export default function CompoundUSDC() {
	
	const { privy } = useAppData();
	const [signer, setSigner] = useState<ethers.Signer | null>(null);
	const [balance, setBalance] = useState("0");
	const [apr, setApr] = useState("0");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
			const init = async () => {

					if (privy.wallet?.status !== 'connected') {
							console.log('🔄 Wallet non encore connecté...');
							return;
					}
					// check wallet provider
					if (!privy.wallet?.provider) {
							console.log('❌ Aucun provider trouvé');
							return;
					}

					const signer = getEthersSigner(privy.wallet.provider);
					const address = await signer.getAddress();

					setSigner(signer);
					await fetchData(signer);
			};

			init();
	}, [privy.wallet]);

	const fetchData = async (signer: Signer) => {
			if (!signer) return;
			// const comet = new ethers.Contract(COMET_ADDRESS, COMET_ABI, signer);
			// const supplyRate = await comet.getSupplyRate();
			// const apr = (supplyRate / 1e27) * 100; // Convertir en pourcentage
			// setApr(apr.toFixed(2));
	};

	const deposit = async () => {
			if (!signer) return;
			setLoading(true);
			try {
					const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
					const comet = new ethers.Contract(COMET_ADDRESS, COMET_ABI, signer);
					const address = await signer.getAddress();
					const amount = await usdc.balanceOf(address);

					const allowance = await usdc.allowance(address, COMET_ADDRESS);
					if (allowance.lt(amount)) {
							const txApprove = await usdc.approve(COMET_ADDRESS, amount);
							await txApprove.wait();
					}

					const txSupply = await comet.supply(USDC_ADDRESS, amount);
					await txSupply.wait();
					await fetchData(signer);
					alert('✅ Dépôt effectué');
			} catch (e) {
					console.error(e);
					alert('Erreur pendant le dépôt');
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
					await fetchData(signer);
					alert('✅ Retrait effectué');
			} catch (e) {
					console.error(e);
					alert('Erreur pendant le retrait');
			}
			setLoading(false);
	};

	useEffect(() => {
			const interval = setInterval(async () => {
					if (signer) await fetchData(signer);
			}, 50000);
			return () => clearInterval(interval);
	}, [signer]);

	const earnPillContent  = () => {
			return (
				<PillMessageBox>
					<FText className="!text-2xl" bold>
						Good Morning!
					</FText>
				</PillMessageBox>
			);
	};

	return (
		<Frame>
			<HeaderBar title="Earn" pillContent={earnPillContent} />
			<ScrollView>
				<FTitle>USDC sur Compound (Base)</FTitle>

				<FText>Solde disponible : {balance} USDC</FText>

				<FText className="mb-4"> APR actuel : {apr}% </FText>
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
