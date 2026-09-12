import { useUser } from '@clerk/expo'
import { Ionicons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FeaturedCard from '../../../../components/FeaturedCard'
import PropertyCard from '../../../../components/PropertyCard'
import { supabase } from '../../../../lib/supabase'
import { Property } from '../../../../types'

export default function HomeScreen() {

  const {user}=useUser()
  const router = useRouter()


  const [featured, setFeatured]= useState<Property[]>([])
  const [recomended, setRecomended]= useState<Property[]>([])

  const [loading,setLoading]= useState(true)

  // console.log(featured,recomended)

  const fetchProperties=async () =>{
    setLoading(true)

    const {data: featuredData}=await supabase.from("properties").select("*").eq("is_featured",true)
    .order("created_at",{ascending:false})

    const {data: recomendedDtat}=await supabase.from("properties").select("*").eq("is_featured",false)
    .order("created_at",{ascending:false})

    setFeatured(featuredData?? [])
    setRecomended(recomendedDtat?? [])
    setLoading(false)
  }

  useFocusEffect(
    useCallback(()=>{
      fetchProperties()
    },[])
  )
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <FlatList
      data={recomended}
      keyExtractor={(item)=>item.id}
      contentContainerStyle={{paddingBottom:100}}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          {/* Header */}

          <View className='flex-row items-center justify-between px-5 pt-4 pb-5'>
            <Image
            source={require("../../../../assets/images/kribb.png")}
            style={{width:90, height:36}}
            resizeMode='contain'
            />

            <View className='items-end'>
              <Text>Good Morning 👋</Text>
              <Text className='text-gray-900 text-base font-bold'>{user?.firstName ?? "User"}</Text>
            </View>
          </View>

          {/* search bar */}

          <TouchableOpacity
          onPress={()=>router.push('/(root)/(tabs)/search')}
          className='mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 text-sm gap-3'

          style={{
            shadowColor:"#000000",
            shadowOffset:{width: 0, height:1},
            shadowOpacity: 0.06,
            shadowRadius:6,
            elevation:1

          }}
          >
            <Ionicons name="search-outline" size={20} color="#9CA3AF"/>
            <Text className='text-gray-400 text-base flex-1'>
              Search properties, cities....
            </Text>
            <TouchableOpacity
             onPress={()=>router.push('/(root)/(tabs)/search?openFilters=true')}
             className='w-8 h-8 bg-blue-600 rounded-xl items-center justify-center'
             >
              <Ionicons name="options-outline" size={15} color="white"/>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Featured Section */}
          <View className='mb-6'>
            <Text className='text-gray-900 text-lg font-bold px-5 mb-4'>Featured</Text>
          </View>

          {
            loading ?(
              <ActivityIndicator size="small"
                color="#2563EB"
                className='py-10'
              />
            ):(
              <FlatList
                data={featured}
                keyExtractor={item=>item.id}
                renderItem={({item})=><FeaturedCard property={item}/>}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal:20}}
              />
            )
          }

          {/* Recomended Header */}

          <Text className='text-gray-900 text-lg font-bold px-5 mb-4'>Recommended</Text>
        </View>
      }

      renderItem={({item})=>(
        <View className='px-5'>
          <PropertyCard property={item}/>

        </View>
      )}

      ListEmptyComponent={
        !loading? (
          <View className='items-center py-10'>
            <Text className='text-gray-400'>No property found</Text>
          </View>
        ): null
      }
      />
    </SafeAreaView>
    
  )
}