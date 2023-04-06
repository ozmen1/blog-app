using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Entities.Dtos
{
    public class CategoryAddDto
    {
        [DisplayName("Kategori Adı")]
        [Required(ErrorMessage = "{0} alanı boş bırakılmamalıdır.")]
        [MaxLength(70, ErrorMessage = "{0} alanının uzunluğu {1} karakterden fazla olmamalıdır.")]
        [MinLength(3, ErrorMessage = "{0} alanının uzunluğu {1} karakterden az olmamalıdır.")]
        public string Name { get; set; }



        [DisplayName("Açıklama")]
        [MaxLength(50, ErrorMessage = "{0} alanının uzunluğu {1} karakterden fazla olmamalıdır.")]
        [MinLength(10, ErrorMessage = "{0} alanının uzunluğu {1} karakterden az olmamalıdır.")]
        public string Description { get; set; }



        [DisplayName("Kategori Özel Notu")]
        [MaxLength(500, ErrorMessage = "{0} alanının uzunluğu {1} karakterden fazla olmamalıdır.")]
        [MinLength(3, ErrorMessage = "{0} alanının uzunluğu {1} karakterden az olmamalıdır.")]
        public string Note { get; set; }



        [DisplayName("Aktif mi?")]
        [Required(ErrorMessage = "{0} alanı boş bırakılmamalıdır.")]
        public bool IsActive { get; set; }
    }
}
