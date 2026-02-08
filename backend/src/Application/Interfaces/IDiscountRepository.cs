using backend.src.domain.Entities.Discounts;

namespace backend.src.application.Interfaces;
public interface IDiscountRepository
{
    // Agrega un nuevo descuento
    Task AddAsync(Discounts discount);
    // Trae todos los descuentos
    Task<List<Discounts>> GetAllAsync();
    // Trae el descueno por ID
    Task<Discounts?> GetByIdAsync(Guid _id);
    // Delete descuento por ID
    Task DeleteAsync(Guid _id);
}
