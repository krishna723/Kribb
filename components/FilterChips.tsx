import { Ionicons } from '@expo/vector-icons'
import { useFilterStore } from '@store/filterStore'
import { Text, TouchableOpacity, View } from 'react-native'
import { formatPrice } from '../lib/utils'

export default function FilterChips({activeFilterCount}:{activeFilterCount:number}) {

    const {
        search,
        type,
        bedrooms,
        minPrice,
        maxPrice,
        setSearch,
        setType,
        setBedrooms,
        setMinPrice,
        setMaxPrice,
    
      }=useFilterStore()
  return (
    <View>
      {activeFilterCount>0 && (
          <View className='flex-row flex-wrap gap-2 mt-3'>
            {type &&(
              <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                <Text className='text-blue-700 text-xs font-semibold capitalize'>
                  {type}
                </Text>
                <TouchableOpacity onPress={()=>setType(null)}>
                  <Ionicons name='close' size={12} color={"#1D4ED8"}/>
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !==null &&(
              <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                <Ionicons name='bed-outline' size={11} color={"#1D4ED8"}/>
                <Text className='text-blue-700 text-xs font-semibold capitalize'>
                  {bedrooms ===4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms >1 ? "s" : ""}`
                  }
                </Text>
                <TouchableOpacity onPress={()=>setBedrooms(null)}>
                  <Ionicons name='close' size={12} color={"#1D4ED8"}/>
                </TouchableOpacity>
              </View>
            )}

            {(minPrice !==null || maxPrice!==null) &&(
              <View className='flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1'>
                <Text className='text-blue-700 text-xs font-semibold capitalize'>
                  {minPrice && maxPrice
                    ?`${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    : minPrice
                    ? `From ${formatPrice(minPrice)}`
                    : `Up to ${formatPrice(maxPrice!)}`

                  }
                </Text>
                <TouchableOpacity onPress={()=>{
                    setMaxPrice(null)
                    setMinPrice(null)
                }}>
                  <Ionicons name='close' size={12} color={"#1D4ED8"}/>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
    </View>
  )
}