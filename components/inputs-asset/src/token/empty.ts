import { constants } from "ethers";

import { TokenType } from "@ethberry/types-blockchain";

import type { ITokenAsset, ITokenAssetComponent } from "./types";

export function getEmptyToken(tokenType = TokenType.ERC20, contractId = 0): any {
  return {
    components: [
      {
        tokenType,
        contractId,
        templateId: 0,
        template: {
          contract: {
            decimals: tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20 ? 18 : 0,
            address: constants.AddressZero,
          },
        },
        token: {
          tokenId: "0",
        },
        amount:
          tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20 ? constants.WeiPerEther.toString() : "1",
      } as ITokenAssetComponent,
    ],
  } as ITokenAsset;
}

export const emptyToken = getEmptyToken(TokenType.ERC721);
