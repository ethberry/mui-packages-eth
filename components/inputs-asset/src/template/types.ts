import type { TokenType } from "@ethberry/types-blockchain";

export interface ITemplateAssetComponent {
  id: number;
  tokenType: TokenType;
  contractId: number;
  templateId: number;
  template: {
    id: number;
    description: string;
    imageUrl: string;
    title: string;
    imgUrl: string;
    tokens: Array<{
      id: number;
      tokenId: string;
    }>;
    contract: {
      id: number;
      title: string;
      address: string;
      decimals: number;
      contractType: TokenType;
      contractFeatures: Array<any>;
    };
  };
  amount: string;
}

export interface ITemplateAsset {
  components: Array<ITemplateAssetComponent>;
}
