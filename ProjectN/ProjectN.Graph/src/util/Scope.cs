using System.Collections.Generic;
using Bridge.Html5;

namespace ProjectN.Graph
{
    public class Scope
    {
        private object scope;

        public Scope()
        {
            scope = new object();
        }

        public void SetValue<T>(string key, T value)
        {
            scope[key] = new ValueWrapper<T>(value);
        }

        public T GetValue<T>(string key)
        {
            var wrapper = (ValueWrapper<T>) scope[key];
            return wrapper.Value;
        }

        public GetNode CreateGetNode(string key)
        {
            var wrapper = (ValueWrapper) scope[key];
            return wrapper.CreateGetNode(this, key);
        }

        public SetNode CreateSetNode(string key)
        {
            var wrapper = (ValueWrapper) scope[key];
            return wrapper.CreateSetNode(this, key);
        }
    }
}