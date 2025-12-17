import { Inject, Injectable } from "@nestjs/common";
import {
  ID,
  Product,
  ProductVariant,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { BASE_PLUGIN_OPTIONS } from "../constants";
import { BasePluginOptions } from "../types";

@Injectable()
export class BasePriceService {

  constructor(
    private connection: TransactionalConnection,
    @Inject(BASE_PLUGIN_OPTIONS) private options: BasePluginOptions
  ) {}

  calculatePricePer100Ml(ctx: RequestContext, variant: ProductVariant): number | undefined {
    if (!variant.customFields?.volume) {
     return undefined;
    }
    return Math.round(variant.priceWithTax / variant.customFields.volume * 100);
  }
}
