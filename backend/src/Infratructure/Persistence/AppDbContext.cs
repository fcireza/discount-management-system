using Microsoft.EntityFrameworkCore;
using backend.src.domain.Entities.Discounts;
using backend.src.domain.Enums;

namespace backend.src.Infratructure.Persistence.AppDbContext;

public class AppDbContext : DbContext
{
    // Lista temporal de descuentos.
    public DbSet<Discounts> Discounts { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    /* Usará automáticamente el nombre de cada clase derivada
     como valor del discriminador, sin necesidad de registrar cada una. */
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Discounts>()
            .HasDiscriminator<DiscountType>("Type")
            .HasValue<PercentageDiscount>(DiscountType.PercentageDiscount)
            .HasValue<FixedAmountDiscount>(DiscountType.FixedAmountDiscount)
            .HasValue<TwoForOneDiscount>(DiscountType.TwoForOneDiscount);
    }
}
