import type { ITemplateAssetComponent } from "../template/types";

export interface ITokenAssetComponent extends ITemplateAssetComponent {
  token: {
    id: number;
    tokenId?: string;
  };
  tokenId: number;
}

export interface ITokenAsset {
  components: Array<ITokenAssetComponent>;
}
