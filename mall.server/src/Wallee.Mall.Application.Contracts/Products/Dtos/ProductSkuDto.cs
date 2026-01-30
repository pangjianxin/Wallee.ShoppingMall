using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Products.Dtos
{
    public class ProductSkuDto : AuditedEntityDto<Guid>
    {
        public Guid ProductId { get; set; }
        /// <summary>
        /// 系统设定原价
        /// </summary>
        public decimal OriginalPrice { get; set; }
        /// <summary>
        /// 系统设定现价
        /// </summary>
        public decimal Price { get; set; }
        /// <summary>
        /// 系统设定库存
        /// </summary>
        public int StockQuantity { get; set; }
        public List<ProductSkuAttributeDto> Attributes { get; set; } = [];
        public string AttributesSignature { get; set; } = string.Empty;
        /// <summary>
        /// 京东SKUID
        /// </summary>
        public string JdSkuId { get; set; } = string.Empty;
        /// <summary>
        /// 京东参考价（仅用于展示/比价，不参与系统销售价计算）。
        /// </summary>
        public decimal? JdPrice { get; set; }
        /// <summary>
        /// 获取折扣显示文本（如"8.5折"）
        /// </summary>
        public string DiscountText { get; set; } = string.Empty;
    }
}
