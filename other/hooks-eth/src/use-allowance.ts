import { Web3ContextType } from "@web3-react/core";
import { useIntl } from "react-intl";
import { enqueueSnackbar } from "notistack";

import { TokenType } from "@ethberry/types-blockchain";
import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers";

import ERC20AllowanceABI from "./allowance-abis/ERC20/allowance.json";
import ERC721IsApprovedForAllABI from "./allowance-abis/ERC721/isApprovedForAll.json";
import ERC1155IsApprovedForAllABI from "./allowance-abis//ERC1155/isApprovedForAll.json";

import ERC20ApproveABI from "./allowance-abis/ERC20/approve.json";
import ERC721SetApprovalForAllABI from "./allowance-abis/ERC721/setApprovalForAll.json";
import ERC1155SetApprovalForAllABI from "./allowance-abis/ERC1155/setApprovalForAll.json";

// Where to import IAsset?
interface IAsset {
  token: string;
  amount?: BigNumberish;
  tokenType: TokenType;
  tokenId?: string | number;
}

export interface IUseAllowanceOptionsParams {
  contract: string;
  assets: IAsset[];
}

/**
 * NATIVE - does not require approve
 * ERC20 - combines all items by token address
 * ERC721/ERC998 - remove duplicates of token address
 * ERC1155 - remove duplicates of token address
 */
export const groupAssetsByContract = (assets: Array<IAsset>) => {
  const grouped: Record<string, IAsset> = {};

  for (const asset of assets) {
    const { token, tokenType, amount } = asset;

    // If the token doesn't exist in the group, add it.
    if (!grouped[token]) {
      grouped[token] = asset;
    } else {
      // Dublication of the token
      if (tokenType === TokenType.ERC20 && amount /* amount can be undefined */) {
        // If the token is ERC20, combine amount.
        const updatedAmount = BigNumber.from(grouped[token].amount).add(amount);
        grouped[token].amount = updatedAmount;
      } else {
        // If the Token Is 721 / 998 / 1155
        // We just have to skip, for duplicates transactions
        // Skip...
      }
    }
  }

  return Object.values(grouped);
};

export const checkAllowance = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, amount = 1n } = asset;
  // NATIVE
  if (tokenType === TokenType.NATIVE) {
    return true;
  }

  // ERC20
  else if (tokenType === TokenType.ERC20) {
    const contractErc20 = new Contract(token, ERC20AllowanceABI, web3Context.provider?.getSigner());
    const allowanceAmount = (await contractErc20.allowance(web3Context.account, contract)) as number;
    return BigNumber.from(allowanceAmount).gte(amount);
  }

  // ERC721 & ERC998
  else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
    const contractErc721 = new Contract(token, ERC721IsApprovedForAllABI, web3Context.provider?.getSigner());
    return contractErc721.isApprovedForAll(web3Context.account, contract) as boolean;
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155IsApprovedForAllABI, web3Context.provider?.getSigner());
    return contractErc1155.isApprovedForAll(web3Context.account, contract) as boolean;
  }

  // UNKNOWN TOKEN TYPE
  else {
    throw new Error("unsupported token type");
  }
};

export const approveTokens = async (contract: string, asset: IAsset, web3Context: Web3ContextType) => {
  const { token, tokenType, amount = 1n } = asset;

  // ERC20
  if (tokenType === TokenType.ERC20) {
    const contractErc20 = new Contract(token, ERC20ApproveABI, web3Context.provider?.getSigner());
    return contractErc20.approve(contract, amount) as Promise<ContractTransaction>;
  }

  // ERC721 & ERC998
  else if (tokenType === TokenType.ERC721 || tokenType === TokenType.ERC998) {
    const contractErc721 = new Contract(token, ERC721SetApprovalForAllABI, web3Context.provider?.getSigner());
    return contractErc721.setApprovalForAll(contract, true) as Promise<ContractTransaction>;
  }

  // ERC1155
  else if (tokenType === TokenType.ERC1155) {
    const contractErc1155 = new Contract(token, ERC1155SetApprovalForAllABI, web3Context.provider?.getSigner());
    return contractErc1155.setApprovalForAll(contract, true) as Promise<ContractTransaction>;
  }

  // Unknown Token Type
  else {
    throw new Error("unsupported token type");
  }
};

export const useAllowance = (
  fn: (web3Context: Web3ContextType, ...args: Array<any>) => Promise<any>,
  options: { error?: boolean; success?: boolean } = {},
): ((params: IUseAllowanceOptionsParams, web3Context: Web3ContextType, ...args: Array<any>) => Promise<any>) => {
  const { error = true } = options;
  const { formatMessage } = useIntl();

  return async (
    params: IUseAllowanceOptionsParams,
    web3Context: Web3ContextType,
    ...args: Array<any>
  ): Promise<any> => {
    const assets = groupAssetsByContract(params.assets);

    for (const asset of assets) {
      try {
        const hasAllowance = await checkAllowance(params.contract, asset, web3Context);

        if (!hasAllowance) {
          const tx = await approveTokens(params.contract, asset, web3Context);
          await tx.wait();
        }
      } catch (e) {
        if (error) {
          enqueueSnackbar(formatMessage({ id: "snackbar.insufficientAllowance" }), { variant: "error" });
          console.error(`[allowance error] ${formatMessage({ id: "snackbar.insufficientAllowance" })}`, e);
          return null;
        }
        throw new Error(e);
      }
    }
    return fn(web3Context, ...args);
  };
};
