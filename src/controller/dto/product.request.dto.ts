import { Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

// Created a custom validation to ensure user input is what our dummy API can provide
@ValidatorConstraint({ name: 'productIdLength', async: false })
export class productIdLength implements ValidatorConstraintInterface {
    validate(productId: string) {
        return +productId >= 1 && +productId <= 10;
    }

    defaultMessage() {
        return 'productId must be between 1 - 10';
    }
}

export class GetProductDTO {
    @Validate(productIdLength)
    productId: string;
}
