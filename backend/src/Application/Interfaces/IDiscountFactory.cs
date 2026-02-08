using backend.src.application.DTOs.createDiscountDto;
using backend.src.domain.Entities.Discounts;

namespace backend.src.application.Interfaces;
public interface IDiscountFactory
{
    Discounts CreateDiscount(CreateDiscountDto dto);

}