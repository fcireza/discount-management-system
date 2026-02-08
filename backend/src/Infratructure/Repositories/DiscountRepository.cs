using Microsoft.EntityFrameworkCore;
using backend.src.application.Interfaces;
using backend.src.domain.Entities.Discounts;
using backend.src.Infratructure.Persistence.AppDbContext;

namespace backend.src.Infratructure.Repositories;
public class DiscountRepository : IDiscountRepository
{
    private readonly AppDbContext _context;

    public DiscountRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Discounts discount)
    {
        _context.Discounts.Add(discount);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Discounts>> GetAllAsync()
    {
        return await _context.Discounts.ToListAsync();
    }

    public async Task<Discounts?> GetByIdAsync(Guid id)
    {
        return await _context.Discounts.FirstOrDefaultAsync(d => d._discountId == id);
    }

    public async Task DeleteAsync(Guid id)
    {
        var discount = await GetByIdAsync(id);
        if (discount is null) return;

        _context.Discounts.Remove(discount);
        await _context.SaveChangesAsync();
    }
}
