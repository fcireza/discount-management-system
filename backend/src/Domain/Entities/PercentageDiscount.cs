namespace backend.src.domain.Entities.Discounts;
using backend.src.domain.Enums;
using backend.src.application.DTOs.createDiscountDto;

public class PercentageDiscount : Discounts
{
    public float _percentage { get; private set; }

    private PercentageDiscount() : base(Guid.Empty, string.Empty, DiscountType.PercentageDiscount)
    {
    }

    public PercentageDiscount(Guid discountId, string Name, float percentage) :
     base(discountId, Name, DiscountType.PercentageDiscount)
    {
        this._percentage = percentage;
    }

    public override ValidationResult ValidateCreate(CreateDiscountDto dto)
    {
        if (dto.Percentage < 0 || dto.Percentage > 100)
        {
            return ValidationResult.Failure("Percentage must be between 0 and 100.");
        }
        return ValidationResult.Success();
    }

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Calcula el Total
        float originalTotal = CalculateOriginalTotal(unitPrice, quantity);
        // Calcula Descuento
        float discount = (originalTotal * this._percentage) / 100;
        
        return discount;
    }
}