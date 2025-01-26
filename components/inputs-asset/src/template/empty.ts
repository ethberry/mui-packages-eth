import { constants } from "ethers";

import { TokenType } from "@ethberry/types-blockchain";
import { imageUrl } from "@ethberry/constants";

import type { ITemplateAsset, ITemplateAssetComponent } from "./types";

export function getEmptyTemplate(tokenType = TokenType.NATIVE): any {
  return {
    components: [
      {
        // id: 0, breaks validation
        tokenType,
        contractId: 0,
        templateId: 0,
        template: {
          id: 0,
          title: "",
          description: JSON.stringify({
            blocks: [
              {
                key: "ee782",
                text: "",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {},
          }),
          imageUrl,
          contract: {
            id: 0,
            title: "",
            contractType: tokenType,
            contractFeatures: [] as Array<any>,
            decimals: tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20 ? 18 : 0,
            address: constants.AddressZero,
          },
        },
        amount:
          tokenType === TokenType.NATIVE || tokenType === TokenType.ERC20 ? constants.WeiPerEther.toString() : "1",
      } as ITemplateAssetComponent,
    ],
  } as ITemplateAsset;
}

export const emptyPrice = getEmptyTemplate(TokenType.NATIVE);

export const emptyItem = getEmptyTemplate(TokenType.ERC721);
