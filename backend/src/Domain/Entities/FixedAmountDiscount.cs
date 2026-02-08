using backend.src.domain.Enums;
using backend.src.application.DTOs.createDiscountDto;

namespace backend.src.domain.Entities.Discounts;
public class FixedAmountDiscount : Discounts
{
    public float _amount { get; private set; }

    private FixedAmountDiscount() : base(Guid.Empty, string.Empty, DiscountType.FixedAmountDiscount)
    {
    }

    public FixedAmountDiscount(Guid discountId, string Name, float amount) :
     base(discountId, Name, DiscountType.FixedAmountDiscount)
    { 
        this._amount = (amount <= 0) ? 0 : amount;
    }

    public override ValidationResult ValidateCreate(CreateDiscountDto dto)
    {
        if (dto.Amount < 0)
        {
            return ValidationResult.Failure("Amount must be greater than or equal to 0.");
        }
        return ValidationResult.Success();
    }

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Calcula el Total
        float originalTotal = CalculateOriginalTotal(unitPrice, quantity);
        // Calcula Descuento
        float discount = (originalTotal - this._amount);
        
        return discount >= 0 ? this._amount : originalTotal;
    }
}