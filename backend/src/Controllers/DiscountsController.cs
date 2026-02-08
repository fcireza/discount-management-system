using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.src.application.Services;
using backend.src.application.DTOs.createDiscountDto;
using backend.src.application.DTOs.ApplyDiscountRequestDto;
using System;

namespace DiscountsControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscountsController : ControllerBase
    {
        private readonly DiscountService _service;
        public DiscountsController(DiscountService service)
        {
            _service = service;
        }

        // POST /api/discounts
        // CREATE Object Discount
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDiscountDto dto)
        {
            try
            {
                await _service.CreateDiscountAsync(dto);
                return Ok();
            }
            catch (System.Exception exception)
            {
                // Log the exception (not implemented here)
                return StatusCode(500, "Error: " + exception.Message);
            }
        }

        // GET /api/discounts
        // Trae todos los descuentos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var discounts = await _service.getAllDiscounts();
                return Ok(discounts);
            }
            catch (System.Exception exception)
            {
                return StatusCode(500, "Error: " + exception.Message);
            }

        }

        // GET /api/discounts/{id}
        // Trae UN descuento por ID
        [HttpGet("{discountId:guid}")]
        public async Task<IActionResult> GetById(Guid discountId)
        {
            try
            {
                var discount = await _service.GetDiscountById(discountId);
                if (discount is null)
                {
                    return StatusCode(404, "Discount not found");
                }
                return Ok(discount);
            }
            catch (System.Exception exception)
            {
                return StatusCode(500, "Error: " + exception.Message);
            }
        }

        // DELETE /api/discounts/{id}
        // Elimina un descuento por ID
        [HttpDelete("{discountId:guid}")]
        public async Task<IActionResult> Delete(Guid discountId)
        {
            try
            {
                var discount = await _service.GetDiscountById(discountId);
                // Valida si existe
                if (discount is null)
                {
                    return StatusCode(404, "Discount not found");
                }
                // Lo borra
                await _service.DeleteById(discountId);
                return NoContent();
            }
            catch (System.Exception exception)
            {
                return StatusCode(500, "Error: " + exception.Message);
            }
        }

        // POST /api/discounts/apply
        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] ApplyDiscountRequestDto dto)
        {
            try
            {
                var result = await _service.ApplyDiscount(dto);

                return Ok(result);
            }
            catch (System.Exception exception)
            {
                return StatusCode(500, "Error: " + exception.Message);
            }
        }
    }
}