namespace backend.src.domain.Entities.Discounts;
using backend.src.domain.Enums;

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

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Calcula el Total
        float originalTotal = CalculateOriginalTotal(unitPrice, quantity);
        // Calcula Descuento
        float discount = (originalTotal * this._percentage) / 100;
        
        return discount;
    }
}