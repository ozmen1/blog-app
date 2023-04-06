using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Shared.Utilities.Result.Abstract
{
    public interface IDataResult<out T> : IResult
    {
        public T Data { get; }
        //new DataResult<Category>(ResultStatus.Success, category)
        //new DataResult<IList<Category>>(ResultStatus.Success, categories)
        //new DataResult<IList<Category>>(ResultStatus.Success, "İşlem başarılır", categories)
    }
}
