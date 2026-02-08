using backend.src.domain.Entities;
using backend.src.domain.Enums;

namespace backend.src.domain.Entities.Discounts;
public class TwoForOneDiscount : Discounts
{

    private TwoForOneDiscount() : base(Guid.Empty, string.Empty, DiscountType.TwoForOneDiscount)
    {
    }
    
    public TwoForOneDiscount(Guid discountId, string Name) :
     base(discountId, Name, DiscountType.TwoForOneDiscount)
    {
    }

    public override ValidationResult Validate(int quantity)
    {
        var baseResult = base.Validate(quantity);
        if (!baseResult.IsValid)
            return baseResult;

        if (quantity < 2)
            return ValidationResult.Failure("TwoForOne discount requires a minimum of 2 items.");

        return ValidationResult.Success();
    }

    public override float CalculateDiscount(float unitPrice, int quantity)
    {
        // Obtenemos los items gratis
        int freeItems = quantity / 2;

        // Calculamos los item gratis por el precio, nos da el descuento
        float discount = freeItems * unitPrice;
        return discount;
    }
}