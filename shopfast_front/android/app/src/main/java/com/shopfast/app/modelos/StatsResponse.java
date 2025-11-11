package com.shopfast.app.modelos;

public class StatsResponse {
    private int total_users;
    private int total_items;
    private int total_shopping_lists;
    private int items_purchased;
    private int items_pending;
    private String created_at;


    public int getTotal_users() {
        return total_users;

    }

    public int getTotal_items() {
        return total_items;
    }

    public int getTotal_shopping_lists() {
        return total_shopping_lists;
    }

    public int getItems_purchased() {
        return items_purchased;
    }

    public int getItems_pending() {
        return items_pending;
    }

    public String getCreated_at() {
        return created_at;
    }

}
