using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApp.Shared.Utilities.Result.ComplexTypes
{
    public enum ResultStatus
    {
        Success=0,
        Error=1,
        Warning=2, // ResultStatus.Warning kullanımında aslında arka planda 2 değeri tutulacak
        Info=3
    }

 
}
