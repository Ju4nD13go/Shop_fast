package com.shopfast.app.modelos;

public class ItemResponse {
    private String id;
    private String name;
    private int quantity;
    private boolean purchased;
    private String user_id;
    private String list_id;

    private String created_at;


    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public boolean getPurchased() {
        return purchased;
    }

    public String getUser_id() {
        return user_id;
    }

    public String getList_id() {
        return list_id;
    }

    public String getCreated_at() {
        return created_at;
    }
}
