import { CategoryRoute } from './category.route';
import { CustomerRoute } from './customer.route';
import { ProductRoute } from './product.route';
import { SaleRoute } from './sale.route';
import { UserRoute } from './user.route';

export function MainRoute(app: any) {
    return app
        .group('/user', UserRoute)
        .group('/product', ProductRoute)
        .group('/category', CategoryRoute)
        .group('/sale', SaleRoute)
        .group('/customer', CustomerRoute);
}