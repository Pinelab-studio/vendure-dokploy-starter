import { Order, OrderCodeStrategy, RequestContext, DefaultOrderCodeStrategy, Injector } from "@vendure/core";
import { BASE_PLUGIN_OPTIONS } from "../constants";
import { BasePluginOptions } from "../types";

/**
 * An order code strategy that uses a prefix and prefixes the channel code and the default order code strategy.
 */
export class BaseOrderCodeStrategy implements OrderCodeStrategy {


    private readonly defaultOrderCodeStrategy = new DefaultOrderCodeStrategy();
    private orderCodePrefix: string;

    init(injector: Injector) {
        this.orderCodePrefix = injector.get<BasePluginOptions>(BASE_PLUGIN_OPTIONS).orderCodePrefix;
    }


    generate(ctx: RequestContext): string {
        const defaultCode = this.defaultOrderCodeStrategy.generate(ctx);
        return `${this.orderCodePrefix}-${ctx.channel.code}-${defaultCode}`;
    }
}