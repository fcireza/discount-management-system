using backend.src.domain.Enums;

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

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Calcula el Total
        float originalTotal = CalculateOriginalTotal(unitPrice, quantity);
        // Calcula Descuento
        float discount = (originalTotal - this._amount);
        
        return discount >= 0 ? this._amount : originalTotal;
    }
}