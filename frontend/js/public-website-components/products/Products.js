
export type ProductSectionType = {
    name: string,
    slug: string,
    renderContent: () => any,
};

export type ProductPageType = {
    title: string,
    banner: number,
    sections: Array<ProductSectionType>,
};

export type ProductType = {
    name: string,
    link: string,
    image: number,
    page: ProductPageType,
    component: any,
};

import Product1 from './Product1';
import Product2 from './Product2';
import Product3 from './Product3';
import Product4 from './Product4';

export const ProductList: Array<ProductType> = [
    Product1,
    Product2,
    Product3,
    Product4,
];

export const ProductMap: {[string]: ProductType} =
    ProductList
        .map(p => {return {[p.name]: p}}) // Array<ProductType> => Array<{[ProductType.name]: ProductType}>
        .reduce((a, b) => {return {...a, ...b}}, {}); // Array<{[ProductType.name]: ProductType}> => {[ProductType.name]: ProductType}
