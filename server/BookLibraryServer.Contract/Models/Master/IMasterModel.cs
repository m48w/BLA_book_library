using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibraryServer.Contract.Models.Master
{
    public interface IMasterModel
    {   
        public int? Id { get; }
        public string? Name { get; }

    }
}
