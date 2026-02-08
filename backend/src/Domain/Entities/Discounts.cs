using backend.src.domain.Entities;
using backend.src.domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace backend.src.domain.Entities.Discounts;

[JsonDerivedType(typeof(PercentageDiscount), typeDiscriminator: "percentage")]
[JsonDerivedType(typeof(FixedAmountDiscount), typeDiscriminator: "fixedAmount")]
[JsonDerivedType(typeof(TwoForOneDiscount), typeDiscriminator: "twoForOne")]
public abstract class Discounts
{
    [Key]
    public Guid _discountId { get; private set; } = Guid.Empty;
    public string _name { get; private set; } = string.Empty;
    public DiscountType _typeDiscount { get; private set; }

    public Discounts(Guid discountId, string Name, DiscountType typeDiscount)
    {
        this._discountId = discountId;
        this._name = Name;
        this._typeDiscount = typeDiscount;
    }

    public abstract float CalculateDiscount(float unitPrice, int quantity);

    public virtual ValidationResult Validate(int quantity)
    {
        if (quantity <= 0)
            return ValidationResult.Failure("Quantity must be greater than zero.");

        return ValidationResult.Success();
    }

    protected float CalculateOriginalTotal(float unitPrice, int quantity)
    {
        return unitPrice * quantity;
    }
}