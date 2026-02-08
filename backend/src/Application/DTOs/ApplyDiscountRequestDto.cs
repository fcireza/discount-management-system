namespace backend.src.application.DTOs.ApplyDiscountRequestDto{
    public class ApplyDiscountRequestDto
    {
        public float unitPrice { get; set; }
        public int quantity { get; set; }
        public Guid discountId { get; set; }
    }
}