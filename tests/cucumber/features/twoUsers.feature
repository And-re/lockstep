@focus
Feature: Two users at the same time

  # The background will be run for every scenario
#  Background:

  Scenario: Creating two anonymous accounts works
    Given I am a new user
    When Alice goes to "/"
    And Bob goes to "/"
    And Alice should not be logged in
    And Bob should not be logged in
    Then Alice goes to "/focus"
    And Bob goes to "/focus"
    And Alice should be logged in
    And Bob should be logged in
    And Alice should see her name in navbar
    And Bob should see his name in navbar
