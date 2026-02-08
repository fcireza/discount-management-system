
using backend.src.application.DTOs;
using backend.src.application.Interfaces;
using backend.src.domain.Entities.Discounts;
using backend.src.domain.Enums;

namespace backend.src.Infratructure.Factories;
public class DiscountFactory : IDiscountFactory
{
    /* Mapea el DTO a la entidad correspondiente, y lo crea.*/
    public Discounts CreateDiscount(CreateDiscountDto dto)
    {
        return dto.Type switch
        {
            DiscountType.PercentageDiscount => new PercentageDiscount(Guid.NewGuid(), dto.Name, dto.Percentage ?? 0),
            DiscountType.FixedAmountDiscount => new FixedAmountDiscount(Guid.NewGuid(), dto.Name, dto.Amount ?? 0),
            DiscountType.TwoForOneDiscount => new TwoForOneDiscount(Guid.NewGuid(), dto.Name),
            _ => throw new ArgumentException("Invalid discount type")
        };
    }
}