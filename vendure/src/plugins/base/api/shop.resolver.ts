import {
    Parent,
    ResolveField,
    Resolver
} from "@nestjs/graphql";
import {
    Ctx,
    ProductVariant,
    RequestContext
} from "@vendure/core";
import { BasePriceService } from "../services/base-price-service";

@Resolver()
export class ShopResolver {
  constructor(private basePriceService: BasePriceService) {}

  // Order of these 2 decorators matters!
  @ResolveField()
  @Resolver("ProductVariant")
  pricePer100MlWithTax(@Ctx() ctx: RequestContext, @Parent() variant: ProductVariant) {
    return this.basePriceService.calculatePricePer100Ml(ctx, variant);
  }
}
