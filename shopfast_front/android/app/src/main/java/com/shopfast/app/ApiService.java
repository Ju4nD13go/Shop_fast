package com.shopfast.app;



import com.shopfast.app.modelos.*;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public interface ApiService {

    //Autenticacion
    @POST("auth/login")
    Call<TokenResponse> login(@Body LoginRequest request);

    @POST("auth/register")
    Call<UserResponse> register(@Body LoginRequest request);

    @GET("auth/me")
    Call<UserResponse> getCurrentUser(@Header("Authorization") String bearerToken);

    //Listas

    @GET("lists/")
    Call<List<ShoppingListResponse>> getShoppingLists(@Header("Authorization") String bearerToken);

    @POST("items/")
    Call<List<ItemResponse>> getItems(@Header("Authorization") String bearerToken);

    @GET("stats/")
    Call<StatsResponse> getUserStats(@Header("Authorization") String bearerToken);
}
