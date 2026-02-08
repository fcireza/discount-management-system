using backend.src.domain.Entities.Discounts;
using backend.src.Infratructure.Persistence.AppDbContext;

namespace Infrastructure.Persistence.DbMockups;

public static class DbMockups
{
    public static void Seed(AppDbContext context)
    {
        if (context.Discounts.Any())
            return;

        var discounts = new List<Discounts>
        {
            new PercentageDiscount(
                discountId: Guid.NewGuid(),
                Name: "10% OFF",
                percentage: 10
            ),

            new PercentageDiscount(
                discountId: Guid.NewGuid(),
                Name: "25% OFF",
                percentage: 25
            ),

            new FixedAmountDiscount(
                discountId: Guid.NewGuid(),
                Name: "$500 OFF",
                amount: 500
            ),

            new TwoForOneDiscount(
                discountId: Guid.NewGuid(),
                Name: "Promo 2x1"
            )
        };

        context.Discounts.AddRange(discounts);
        context.SaveChanges();
    }
}
