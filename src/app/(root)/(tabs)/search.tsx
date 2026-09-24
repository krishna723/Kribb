import { Ionicons } from '@expo/vector-icons'
import { useFilterStore } from '@store/filterStore'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FilterChips from '../../../../components/FilterChips'
import FilterModal from '../../../../components/FilterModal'
import PropertyCard from '../../../../components/PropertyCard'
import { supabase } from '../../../../lib/supabase'
import { Property } from '../../../../types'

export default function Search() {

  const [result, setResult]= useState<Property[]>([])
  const [loading, setLoading]=useState(false)
  const [showFilters, setShowFilters]= useState(false)

  const{openFilters}=useLocalSearchParams<{openFilters?: string}>()
  console.log(openFilters)
  useEffect(()=>{
    if(openFilters=='true'){
      setShowFilters(true)
      console.log(showFilters)
    }
  },[openFilters])

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

  const activeFilterCount=[
    type !==null,
    bedrooms !== null,
    minPrice !==null,
    maxPrice !==null
  ].filter(Boolean).length

  useEffect(()=>{
    fetchResults()
  },[search,type,bedrooms,minPrice,maxPrice])


  const fetchResults=async ()=>{
    setLoading(true)

    let query=supabase.from("properties").select("*")

    if(search){
      query=query.or(`title.ilike.%${search}%,city.ilike.%${search}%`)
    }

    if(type){
      query=query.eq("type",type)
    }
    if(bedrooms){
      query=query.eq("bedrooms",bedrooms)
    }

    if(minPrice){
      query=query.gte("price",minPrice)
    }
    if(maxPrice){
      query=query.lte("price",maxPrice)
    }
    const {data}=await query.order("created_at",{
      ascending: false
    })
    setResult(data ?? [])
    setLoading(false)
  }



  
  // const activeFilterCount=1

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='px-5 pt-4 pb-3'>
        <Text className='text-2xl font-bold text-gray-900 mb-4'>
          Find property
        </Text>

        <View className='flex-row items-center gap-3'>
          <View 
            className='flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3'  
            style={{
            shadowColor:"#000000",
            shadowOffset:{width: 0, height:1},
            shadowOpacity: 0.06,
            shadowRadius:6,
            elevation:1

            }}
          >
            <Ionicons name='search-outline' size={18} color={"#9CA3AF"}/>
            <TextInput
              className='flex-1 py-3 text-gray-800'
              placeholder='Search by title or city ...'
              placeholderTextColor={"#9CA3AF"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize='none'
            />

            {
              search.length>0 && (
                <TouchableOpacity onPress={()=>setSearch("")}>
                  <Ionicons name='close-circle' size={18} color={"#9CA3AF"}/>
                </TouchableOpacity>
              )
            }
          </View>

          <TouchableOpacity

            onPress={()=>setShowFilters(true)}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              activeFilterCount>0 ? "bg-blue-600" : "bg-white"
            }`}

            style={{
            shadowColor:"#000000",
            shadowOffset:{width: 0, height:1},
            shadowOpacity: 0.06,
            shadowRadius:6,
            elevation:1

            }}
          >
            <Ionicons 
              name='options-outline'
              size={20}
              color={activeFilterCount>0 ? '#ffffff': '#374151'}
            />

            {activeFilterCount>0 && (
              <View className='absolute -top-1 -right-1
              w-4 h-4 bg-red-500 rounded-full items-center justify-center'>
                <Text className='text-white text-[9px] font-bold'>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <FilterChips activeFilterCount={activeFilterCount}/>
      </View>

      {/* Results */}

      <FlatList
            data={result}
            keyExtractor={(item)=>item.id}
            contentContainerStyle={{padding: 20, paddingBottom:100}}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text className='text-sm text-gray-400 mb-4'>
                {loading ? "Searching..." : `${result.length} properties found`}
              </Text>
            }
      
            renderItem={({item})=>(
                <PropertyCard property={item}/>
      
            )}
      
            ListEmptyComponent={
              !loading? (
                <View className='items-center py-10'>
                  <Text className='text-gray-400'>No property found</Text>
                  <Text className='text-gray-300 text-sm mt-1'>
                    Try a different search or adjust filters
                  </Text>
                </View>
              ): (
                <ActivityIndicator size={"large"} color={"#2563EB"} className='py-20'/>
              )
            }
            />

      {/* Filter Modal */}

      <FilterModal
       visible={showFilters}
       onClose={()=>setShowFilters(false)}
      />
    </SafeAreaView>
    
  )
}