using backend.src.application.DTOs.ApplyDiscountRequestDto;
using backend.src.application.DTOs.DiscountResponseDto;
using backend.src.application.DTOs.createDiscountDto;
using backend.src.application.Interfaces;
using backend.src.domain.Entities.Discounts;

namespace backend.src.application.Services;
public class DiscountService
{
    private readonly IDiscountFactory _factory;
    private readonly IDiscountRepository _repository;

    public DiscountService(
        IDiscountFactory factory,
        IDiscountRepository repository)
    {
        _factory = factory;
        _repository = repository;
    }

    public async Task CreateDiscountAsync(CreateDiscountDto dto)
    {
        var discount = _factory.CreateDiscount(dto);
        await _repository.AddAsync(discount);
    }

    public async Task<IEnumerable<Discounts>> getAllDiscounts()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Discounts?> GetDiscountById(Guid discountId)
    {
        return await  _repository.GetByIdAsync(discountId);
    }

    public async Task DeleteById(Guid discountId)
    {
        await _repository.DeleteAsync(discountId);
    }
    
    public async Task<DiscountResponseDto> ApplyDiscount(ApplyDiscountRequestDto dto)
    {
        var getDiscount = await _repository.GetByIdAsync(dto.discountId)
            ?? throw new Exception("Discount not found");

        var validation = getDiscount.ValidateApply(dto);
        if (!validation.IsValid)
            throw new ArgumentException(validation.ErrorMessage);

        var discountValue = getDiscount.CalculateDiscount(dto.unitPrice, dto.quantity);

        var objectDto = new DiscountResponseDto
        {
            discountId = dto.discountId,
            originalTotal = (dto.unitPrice * dto.quantity),
            discountedApplied = discountValue,
            finalTotal = (dto.unitPrice * dto.quantity) - discountValue
        };


        return objectDto;
    }
}
