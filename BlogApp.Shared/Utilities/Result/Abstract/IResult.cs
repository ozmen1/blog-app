using BlogApp.Shared.Utilities.Result.ComplexTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Shared.Utilities.Result.Abstract
{
    public interface IResult
    {
        public ResultStatus ResultStatus { get;  } //ResultStatus.Error, ResultStatus.Success
        public string Message { get;  } //Hata mesajlarını bununla taşıyacağız
        public Exception Exception { get;  } //Hataları(exceptions) bununla taşıyacağız
    }
}
