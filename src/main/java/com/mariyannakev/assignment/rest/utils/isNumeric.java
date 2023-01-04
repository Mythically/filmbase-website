package com.mariyannakev.assignment.rest.utils;

public class isNumeric {
    public static boolean isNumeric(String str) {
        for (char c : str.toCharArray()) {
            if (!Character.isDigit(c)) return false;
        }
        return true;
    }
}

