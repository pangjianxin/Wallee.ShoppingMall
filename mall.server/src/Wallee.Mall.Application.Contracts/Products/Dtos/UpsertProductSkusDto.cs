using System.Collections.Generic;

namespace Wallee.Mall.Products.Dtos
{
    public class UpsertProductSkusDto
    {
        public List<UpdateProductSkuDto> Items { get; set; } = [];

        /// <summary>
        /// 是否在批量操作前验证 SkuCode 在本次提交中也不重复。
        /// </summary>
        public bool ValidateSkuCodeUniqueness { get; set; } = true;
    }
}
